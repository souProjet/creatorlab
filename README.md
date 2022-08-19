
# CREATORLAB https://creatorlab.art

Creatorlab est une alternative à E-lyco et Pronote avec une interface userfriendly et une ergonomie sans précédent par rapport à nos amis E-lyco et Pronote.
Vos identifiants FranceConnect ne sont en **aucun** cas stocké d'une quelconque manière et j'assumer une totale transparence vis à vis du code source, d'où la diffusion de celui-ci en open-source.Vous êtes libre de contribuer au projet de la façon que vous voulez que se sois en ouvrant des issues en cas de problème ou en proposant de nouvelles fonctionnalitées.

## Les fonctionnalitées

 - Espace "Mes cours" contenant actualité, plan et mise à jour des cours.
 - "Mon cloud" est un espace **esculsif** à Creatorlab vous permettant de stocker vos donnée dans un espace sécurisé avec une limite de 100Mo par upload.
 -  Espace "Emploie du temps" vous permet de visualiser votre emploie du temps calqué sur celui de Pronote.
 - "Mes notes" affiche vos notes par matière avec un coloration des notes relative à la moyenne de la classe et il y a un indicateur de réussite pour chaque note basé sur vos autres notes.
 - En haut à droite se trouve vos notifications relative à E-lyco.
 - Vos pouvez aussi retrouver vos messages privée en haut à droite.
 - Un système de feed est mis à profit sur la page d'accueil ne servant pour l'instant pas à grand chose ne serait-ce qu'a partager quelques informations.


## Démarrer cratorlab dans un environnement local
Il vous faudra crée un dossier `utils` à la racine et y crée à l'intérieur un fichier `config.json`
y contenant les identifiants de votre base de donnée mysql et autre sous cette forme : 
```json
{
	"port": "3000", 
	"host": "localhost",
	"user": "user", 
	"password": "password", 
	"database": "creatorlab" 
}
```
Enfin il vous sera nécessaire de crée un dossier `userdata` à la racine du projet, ce dossier contiendra les élements du cloud ainsi que les fichiers JSON contenant les notes et l'emploie du temps

## base de donnée
Voilà les prérequis pour la base de donnée, elle contient une table users, posts, et likes :
- table users :
```sql
CREATE TABLE `users` (
  `private_key` varchar(255) DEFAULT NULL,
  `token` varchar(255) DEFAULT NULL,
  `username` varchar(255) DEFAULT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `clientId` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `socketid` varchar(255) DEFAULT NULL,
  `antiforgery_token` varchar(255) DEFAULT NULL
)
```
- table notes :
```sql
CREATE TABLE `notes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `private_key` varchar(255) DEFAULT NULL,
  `content` text,
  `forwhen` varchar(255),
  `created` varchar(255) DEFAULT NULL,
  `token` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
)
```
- table likes :
```sql
CREATE TABLE `likes` (
  `private_key` varchar(255) DEFAULT NULL,
  `note_id` varchar(255) DEFAULT NULL
) 
```

## Crédit
Ce projet à pour but d'aider un maximum de personne et se tronvant juridiquement dans une zone grise merci d'en profiter tout en le respectant!
