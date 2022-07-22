---
layout: post
title: Using SOAP security in dotnet core
image: "/content/images/2019/01/sid-ramirez-791665-unsplash.jpg"
date: '2019-01-18 19:26:55'
tags:
- dotnet
---

During last week, I was migrating some projects to the dotnet core. One of the most irritating parts of such migration is lack of full WebService and WCF support in dotnet core. For example when you google for SOAP security headers you end in GitHub issue [WS Security in .NetCore 2.0 #2605](https://github.com/dotnet/wcf/issues/2605). But seriously is it impossible?

## Code first
First we need to add a custom message header like below
```
var url = configuration.Url;
var wsClient = new ServiceWebClient(
   new BasicHttpBinding(BasicHttpSecurityMode.Transport), 
   new EndpointAddress(url));

using (new OperationContextScope(wsClient.InnerChannel))
{
    OperationContext.Current.OutgoingMessageHeaders.Add(
        new SecurityHeader(username, password, DateTime.Now));
    return wsClient.SomeMethod(requestObject);
}
```

And below a definition of `SecurityHeader`
```
    public class SecurityHeader : MessageHeader
    {
        private readonly string _username;
        private readonly string _nonce;
        private readonly string _created;
        private readonly string _password;

        public SecurityHeader(string username, string password, DateTime created)
        {
            _username = username;
            _nonce = CalculateNonce();
            _created = created.ToString("yyyy-MM-ddTHH:mm:ss.fffZ");
            _password = password;
        }
        
        
        [XmlRoot(ElementName = "Password",
            Namespace = "http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd")]
        public class Password
        {
            [XmlAttribute(AttributeName = "Type")] public string Type { get; set; }
            [XmlText] public string Text { get; set; }
        }

        [XmlRoot(ElementName = "Nonce",
            Namespace = "http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd")]
        public class Nonce
        {
            [XmlAttribute(AttributeName = "EncodingType")]
            public string EncodingType { get; set; }

            [XmlText] public string Text { get; set; }
        }

        [XmlRoot(ElementName = "UsernameToken",
            Namespace = "http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd")]
        public class UsernameToken
        {
            [XmlElement(ElementName = "Username",
                Namespace = "http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd")]
            public string Username { get; set; }

            [XmlElement(ElementName = "Password",
                Namespace = "http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd")]
            public Password Password { get; set; }

            [XmlElement(ElementName = "Nonce",
                Namespace = "http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd")]
            public Nonce Nonce { get; set; }

            [XmlElement(ElementName = "Created",
                Namespace = "http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd")]
            public string Created { get; set; }

            [XmlAttribute(AttributeName = "Id",
                Namespace = "http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd")]
            public string Id { get; set; }
        }

        public override string Name { get; } = "Security";

        public override string Namespace { get; } =
            "http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd";

        protected override void OnWriteHeaderContents(XmlDictionaryWriter writer, MessageVersion messageVersion)
        {
            var serializer = new XmlSerializer(typeof(UsernameToken));
            var pass = CreateHashedPassword(_nonce, _created, _password);
            serializer.Serialize(writer,
                new UsernameToken
                {
                    Username = _username,
                    Password = new Password
                    {
                        Text = pass,
                        Type =
                            "http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-username-token-profile-1.0#PasswordDigest"
                    },
                    Nonce = new Nonce
                    {
                        Text = _nonce,
                        EncodingType =
                            "http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-soap-message-security-1.0#Base64Binary"
                    },
                    Created = _created

                });
        }
        
        private static string CalculateNonce()
        {
            //Allocate a buffer
            var byteArray = new byte[32];
            //Generate a cryptographically random set of bytes
            using (var rnd = RandomNumberGenerator.Create())
            {
                rnd.GetBytes(byteArray);
            }
            //Base64 encode and then return
            return Convert.ToBase64String(byteArray);
        }
        
        private static string CreateHashedPassword(string nonceStr, string created, string password)
        {
            var nonce = Convert.FromBase64String(nonceStr); 
            var createdBytes = Encoding.UTF8.GetBytes(created);
            var passwordBytes = Encoding.UTF8.GetBytes(password);
            var combined = new byte[createdBytes.Length + nonce.Length + passwordBytes.Length];
            Buffer.BlockCopy(nonce, 0, combined, 0, nonce.Length);
            Buffer.BlockCopy(createdBytes, 0, combined, nonce.Length, createdBytes.Length);
            Buffer.BlockCopy(passwordBytes, 0, combined, nonce.Length + createdBytes.Length, passwordBytes.Length);

            return Convert.ToBase64String(SHA1.Create().ComputeHash(combined));
        }
    }
```


The result of above is nice security header:
```
<soapenv:Header>
    <wsse:Security
        xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd"
        xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd">
        <wsse:UsernameToken wsu:Id="UsernameToken-F5BF7F4291E607828515478102461514">
            <wsse:Username>login</wsse:Username>
            <wsse:Password Type="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-username-token-profile-1.0#PasswordDigest">mD64dXigKfYcMTGpiNaiwCwT63o=</wsse:Password>
            <wsse:Nonce EncodingType="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-soap-message-security-1.0#Base64Binary">tjJ6GXQBdrOuvujnoKuhvg==</wsse:Nonce>
            <wsu:Created>2019-01-18T11:17:26.151Z</wsu:Created>
        </wsse:UsernameToken>
    </wsse:Security>
</soapenv:Header>
```

The end!

p.s. Photo by Sid Ramirez on Unsplash