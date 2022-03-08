# Telemedicine Application
Telemedicine, also referred to as telehealth or e-medicine, is the remote delivery of healthcare services, including exams and consultations, over the telecommunications infrastructure.

Due to the Coronavirus pandemic, I wrote this project for my military service as a non-profit project. Although I would be pleased if I could help Covid patients. unfortunately, it was not used because doctors did not show interest, but I ended my military service anyway 😄
![444](https://user-images.githubusercontent.com/6237268/157300644-7cd0b64b-8ff4-4ad3-a880-dae7c5045bb5.jpg)

The implementation of this system has been done in two completely different projects, FrontEnd and Backend separately. The server-side implements a service using [NodeJs](https://github.com/nodejs/node) and [MongoDB](https://github.com/mongodb/mongo) that communicates with RestApi, and the user side implements a single-page application using [Angular](https://github.com/angular/angular) for Frontend, which connects to the backend service using the API.
For real-time communication capabilities, [Socket.IO](https://github.com/socketio/socket.io) and [PeerJs](https://github.com/peers/peerjs) technologies were used, as well as [AdminLTE](https://github.com/ColorlibHQ/AdminLTE) for the front-end template.
![7778](https://user-images.githubusercontent.com/6237268/157300810-ce84dfad-2aa6-44bf-ba8d-93812267e296.jpg)

In terms of server architecture, it is a kind of service-oriented SOA architecture in which a request first reaches the controller API, then it must cross multiple middlewares to reach the desired action. Evaluation occurs first, followed by action, where the service is used to receive or transfer data according to its request. According to the designed model standard, the data is transformed into database schemas and stored in them, and the process is also reversed to receive data from the server.
![333](https://user-images.githubusercontent.com/6237268/157303066-f0b9efe5-ceb8-4930-a008-2831de7e0706.jpg)

This project consists of five main subsystems, each of which has specific tasks in the relevant process, the components of each subsystem are briefly:

### User management 
• User registration 
<br /> •	forget password 
<br /> • Receive and receive tokens 
<br /> • Define and manage users by system admin 
<br /> • Roles and access levels 
<br /> • Personal information and profiles

### Financial
•	Increase credit
<br /> • Virtual wallet
<br /> • doctor's settlements
<br /> • User transactions
<br /> • Admin Bank and Balance
<br /> • Transaction reports

### Appointments and visits
• Physician's weekly schedule
<br /> • Search and receive appointments
<br /> • Filter doctors by name and specialty
<br /> • Manage schedules based on status
<br /> • Complete the appointment and change the status
<br /> • Withdraw appointment

### Messenger and notification
• Send text message
<br /> • Send image and file
<br /> • Socket service
<br /> • Realtime communication
<br /> • Send Push notifications
<br /> • User notifications

### Issuance and management of prescriptions
• Issue a prescription by doctor
<br /> • Send to patient with access level
<br /> • Laboratories panel
<br /> • Pharmacies panel
<br /> • Prescription inquiry with barcode
<br /> • Change prescription status
