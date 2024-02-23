# Microservices

## Position

![image](https://github.com/mohamedelbarrak/Web-Components/assets/66890099/66fc52b6-8a55-49b8-b42e-1d4a0141f6dd)

http://localhost:8091/swagger-ui/index.html#/
j'ai utilisé swagger
![image](https://github.com/mohamedelbarrak/Web-Components/assets/66890099/c251487c-15b2-4338-92f6-8913d35caf66)

GET /positions
![image](https://github.com/mohamedelbarrak/Web-Components/assets/66890099/d5e43aa6-c7e7-4204-ae77-2e21e76230e1)


GET /positions/{id}
![image](https://github.com/mohamedelbarrak/Web-Components/assets/66890099/14ffca50-8e22-4793-a329-9c9472a47e06)

## Student

![image](https://github.com/mohamedelbarrak/Web-Components/assets/66890099/a69d7ddf-4368-497d-8f6c-e09c3e257327)


GET /students
![image](https://github.com/mohamedelbarrak/Web-Components/assets/66890099/30a0e5f1-31ca-454b-8b34-dadabac3670e)

GET /student/{id}

![image](https://github.com/mohamedelbarrak/Web-Components/assets/66890099/246124d1-1cc3-4e83-a6a9-e9ccad1fe8a7)

## Création d’un lien entre les deux services en utilisant Open Feign pour répondre aux besoins

![image](https://github.com/mohamedelbarrak/Web-Components/assets/66890099/680ec0e9-1984-4b37-b94f-a16ab1489271)


Le lien est bien créé:
![image](https://github.com/mohamedelbarrak/Web-Components/assets/66890099/213cd20d-4722-4525-82cd-3d6ba9c9d922)

la même chose pour /{id}
![image](https://github.com/mohamedelbarrak/Web-Components/assets/66890099/c3e39923-8812-49b3-a6b3-03f933bf0e38)


## h2-console position

![image](https://github.com/mohamedelbarrak/Web-Components/assets/66890099/5842c6b0-dac8-4c5e-8ab3-227066e1dfbe)

## h2-console student

![image](https://github.com/mohamedelbarrak/Web-Components/assets/66890099/c8a1f1a3-6eb9-4b17-875d-ee7dc2432645)

## GatewayApplication Routage Static

![image](https://github.com/mohamedelbarrak/Web-Components/assets/66890099/79a1ba79-6ac3-4584-a5be-d8990aed667e)

## Discovery

![image](https://github.com/mohamedelbarrak/Web-Components/assets/66890099/0a9e2c11-ff1e-41c4-bc3b-f6b5568fa34c)

Spring Eureka
http://localhost:8761/

![image](https://github.com/mohamedelbarrak/Web-Components/assets/66890099/0c4fdb31-721e-43bb-bc79-d95c631b1fa9)

Donc, avec le 8761, je peux lister pour voir à quel endroit.

eureka.instance.ip-address=true pour enregistrer les machines en fonction de leur adresse IP

## Routage dynamique (not required to for execution)

Pour avoir le routage dynamique:  spring.cloud.gateway.discovery.locator.enabled=true

http://localhost:8888/POSITION/positions
http://localhost:8888/STUDENT/students

![image](https://github.com/mohamedelbarrak/Web-Components/assets/66890099/0251d563-e45f-471f-8181-c501578961f1)

