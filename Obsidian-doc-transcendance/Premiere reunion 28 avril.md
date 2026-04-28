

## Le Projet

- Jeu survivor
	- Un port dedie pour call depuis le reseau social
		- sans sous domaine (/etc/hosts sans sudo) 
		- on a choisi l'option du port pour faire propre
	- survivor 3d si possible simple [[Preparation premieres semaines]]
		- 2d en fallback
		- crash test prioritaire.
		- mecaniques simples 
		- Objectif de base :
			- deplacements en input
			- auto attack
			- enemy auto move / attack
- Reseau social
	- Default page
		- Page de connexion
		- si connecte : page profile avec feed
	- amis / chat 
		- groupes de chat (2 a 42)
		- image de groupe 
	- profile / stats :
		- relie au jeuz
		- images de profile / banniere 
		- pseudo = ID unique ? ET display name 
		- Profile avec onglets :
			- Posts 
				- cliquer sur un profile : montre tous ses posts
			- Stats du jeu
				- scores / diagrammes / visu
			- Likes
	- Hierarchie des users 
		- un superadmin (la mano del dio) 
			- droit d'admin + promeut admin
		- admin normaux  (delegues du superadmin): 
			- ne peuvent PAS promouvoir admin
			- peuvent :
				- bannir gens
				- moderer posts
		- User :
			- poster
			- jouer
			- liker
			- rejoindre des chats
			- favoris
		

	- Pieges !
		- gerer les images
			- une personne pour gerer ca 
			- un lien dans la db vers le ficher (parse et valide) qui est accessible pour le back

- Orga team : 
	- Obsidian pour la doc
	- Jira pour l'orga
		- Oliv je dig 
		- Benoit en master of tasks 
	- Reunion 1/ semaine voir 2 / mois
		- Met a jour le Jira
	
- Pipelines git
	- Github action  : sur main et / ou dev
		- fmt 
		- linter 
		- tests (BACKEND surtout)
		- review TOUTE La team ?
		- Oliv : voir pour une deploiement prod 
			- Serveur Thyanoui 
			- voir le plus simple pour aller au bout 
	- Branches 
		- Main = prod 
		- dev = stable
		- une branche / feat dans l'ideal
	- commit rules 
		- fix/add/feat:
	