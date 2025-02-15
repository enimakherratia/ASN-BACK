# **ASN-Test - Backend NestJS avec MongoDB et Mongoose**

## **Présentation**  
**ASN-Test Backend** est une API RESTful construite avec **NestJS** pour gérer le backend, utilisant **MongoDB** comme base de données et **Mongoose** pour la gestion des données. L'API reçoit des données depuis le frontend Angular, les valide, et les stocke dans MongoDB.  
**Note :** Pour des raisons de temps, la documentation complète du backend n’a pas pu être réalisée.

## **Technologies et fonctionnalités clés**  
### **Fonctionnalités principales**  
✅ **API RESTful** pour gérer les données  
✅ **Mongoose ORM** pour l'intégration avec MongoDB  
✅ **Validation des données** via des DTO et des pipes  
✅ **Gestion des erreurs** avec des filtres d'exception  
✅ **Authentification JWT** pour sécuriser les endpoints  

### **Architecture**  
Le projet suit une architecture modulaire avec **NestJS**, permettant une gestion flexible et évolutive du backend.

## **Structure des dossiers**  
```
├── src
│   ├── auth
│   │   ├── auth.module.ts
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   ├── products
│   │   ├── products.module.ts
│   │   ├── products.controller.ts
│   │   ├── products.service.ts
│   ├── users
│   │   ├── user.module.ts
│   │   ├── user.controller.ts
│   │   ├── user.service.ts
│   ├── shared
│   │   ├── dto
│   │   ├── pipes
```

### **Organisation du code**  
🔹 **Auth** : Gestion de l'authentification et des tokens JWT  
🔹 **Products** : Importation des produits depuis un fichier Excel, et manipulation des données dans MongoDB  
🔹 **Users** : Gestion des utilisateurs et des opérations liées  
🔹 **Shared** : Composants réutilisables (DTOs, pipes, filtres, etc.)

## **Commencer avec le Backend**

### **Prérequis**  
Avant de commencer, assurez-vous d'avoir les prérequis suivants installés en local :  
- [Node.js](https://nodejs.org/en/) (dernière version stable)  
- [MongoDB](https://www.mongodb.com/try/download/community) (installé et en fonctionnement)


### **Démarrer l'application Backend**  

Clonez le projet :  
```bash
git clone <repository-url>
```

Accédez au répertoire du projet :  
```bash
cd ASNBACK
```

Installez les dépendances :  
```bash
npm install
```

Démarrez le serveur :  
```bash
npm run start
```