# CS7319-Final-Project-Group-Intrepid-Juric-Ola-Mackenzie

Instructions for running Pub/Sub Backend.

Application was created using the following components:
1> Spring Boot 3.3.10
2> RabbitMQ 4.0.7
3> MongoDB 1.4.6
4> Maven 3.9.9
Easiest way to run the Spring Boot Application is through an IDE like Intellij Community as the maven build loads all the dependencies and you can run the application by running the Main Application chatengineApplication.java
Steps for RabbitMQ:
    RabbitMQ:
    Install and run on default port
    Enable the following plugins using rabbitmq-plugins from the sbin install folder with the command rabbitmq-plugins enable <plugin-name>
    1: rabbitmq_stomp
    2: rabbitmq_stream
    3: rabbitmq_web_stomp

 Steps for MongoDB
    Install and run on default port
    Log in through MongoDB Compass
    Create Database cs7319

Run the Main application and Tomcat should start up on port 8080.
You can test the backend by 
