CREATE USER 'test_p7_ocr'@'localhost' IDENTIFIED BY 'D4h-3dYi23_R67op2';
GRANT SELECT, INSERT, UPDATE, DELETE ON * . * TO 'test_p7_ocr'@'localhost';

CREATE DATABASE groupomania;
USE groupomania;

CREATE TABLE compte (
id_compte INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
admin BOOLEAN NOT NULL default false,
email VARCHAR(255) NOT NULL UNIQUE,
password VARCHAR(255) NOT NULL,
nom VARCHAR(100) NOT NULL,
avatar BOOLEAN NOT NULL default false,
date_creation BIGINT NOT NULL,
ip_creation VARCHAR(50) NOT NULL
) ENGINE=INNODB;

CREATE TABLE connexions (
id_connexion INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
id_compte INTEGER NOT NULL,
FOREIGN KEY (id_compte) REFERENCES compte(id_compte) ON DELETE CASCADE,
ip VARCHAR(50) NOT NULL,
date BIGINT NOT NULL
) ENGINE=INNODB;

CREATE TABLE article (
id_article INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
id_compte INTEGER NOT NULL,
FOREIGN KEY (id_compte) REFERENCES compte(id_compte) ON DELETE CASCADE,
titre VARCHAR(255) NOT NULL,
image VARCHAR(255),
texte TEXT,
date BIGINT NOT NULL,
upvote INTEGER NOT NULL,
downvote INTEGER NOT NULL,
commentaire INTEGER NOT NULL,
signalement INTEGER NOT NULL,
ip VARCHAR(50) NOT NULL
) ENGINE=INNODB;

CREATE TABLE commentaire (
id_commentaire INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
id_compte INTEGER NOT NULL,
FOREIGN KEY (id_compte) REFERENCES compte(id_compte) ON DELETE CASCADE,
id_article INTEGER NOT NULL,
FOREIGN KEY (id_article) REFERENCES article(id_article) ON DELETE CASCADE,
texte TEXT NOT NULL,
date BIGINT NOT NULL,
upvote INTEGER NOT NULL,
downvote INTEGER NOT NULL,
signalement INTEGER NOT NULL,
ip VARCHAR(50) NOT NULL
) ENGINE=INNODB;

CREATE TABLE vote_article (
id_compte INTEGER NOT NULL,
FOREIGN KEY (id_compte) REFERENCES compte(id_compte) ON DELETE CASCADE,
id_article INTEGER NOT NULL,
FOREIGN KEY (id_article) REFERENCES article(id_article) ON DELETE CASCADE,
PRIMARY KEY(id_compte,id_article),
vote BOOLEAN DEFAULT false
) ENGINE=INNODB;

CREATE TABLE vote_commentaire (
id_compte INTEGER NOT NULL,
FOREIGN KEY (id_compte) REFERENCES compte(id_compte) ON DELETE CASCADE,
id_commentaire INTEGER NOT NULL,
FOREIGN KEY (id_commentaire) REFERENCES commentaire(id_commentaire) ON DELETE CASCADE,
PRIMARY KEY(id_compte,id_commentaire),
vote BOOLEAN DEFAULT false
) ENGINE=INNODB;

CREATE TABLE signalement (
id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
id_article INTEGER NOT NULL,
FOREIGN KEY (id_article) REFERENCES article(id_article) ON DELETE CASCADE,
id_commentaire INTEGER,
motif TINYINT NOT NULL,
date BIGINT NOT NULL,
id_compte INTEGER NOT NULL,
FOREIGN KEY (id_compte) REFERENCES compte(id_compte) ON DELETE CASCADE
) ENGINE=INNODB;

ALTER TABLE compte AUTO_INCREMENT = 0;
ALTER TABLE connexions AUTO_INCREMENT = 0;
ALTER TABLE article AUTO_INCREMENT = 0;
ALTER TABLE commentaire AUTO_INCREMENT = 0;
ALTER TABLE vote_article AUTO_INCREMENT = 0;
ALTER TABLE vote_commentaire AUTO_INCREMENT = 0;
ALTER TABLE signalement AUTO_INCREMENT = 0;

INSERT INTO compte (admin,email,password,nom,avatar,date_creation,ip_creation) VALUES 
('1', 'ea8ef8a50f12c854adb99fc7dfd5cace65c0c90c4ebc1a32bf1f9c92246d6d7d','$2a$10$bvRA8AdbFnvksB6N5/DFQ.Ytklzl.LEPxUVjg7zJCGM.gxoNgLOFO','Joe Quimby','1','1644371700123','127.0.0.1'),
('0', '263e040f5222bf3ada655c85176f6a6fd44f71f69e13c2a145cd1fd4a545a9f1','$2a$10$bvRA8AdbFnvksB6N5/DFQ.Ytklzl.LEPxUVjg7zJCGM.gxoNgLOFO','Homer Simpson','1','1644462465551','172.253.248.39'),
('0','89c96b94ae1a33cd23e450ec705c231951de513d28bb3c96129b0cba3f891571','$2a$10$bvRA8AdbFnvksB6N5/DFQ.Ytklzl.LEPxUVjg7zJCGM.gxoNgLOFO','Marge Simpson','1','1644462465551','172.253.248.39'),
('0','0ab2140f626e277431fa72b29c208aa23c2cce1d007f275e55a7fd692164b402','$2a$10$bvRA8AdbFnvksB6N5/DFQ.Ytklzl.LEPxUVjg7zJCGM.gxoNgLOFO','Lisa Simpson','1','1644462465551','172.253.248.39'),
('0','8d71492087148d456cd7a8343808ca9b929341b46b462e507078de50f0ebc776','$2a$10$bvRA8AdbFnvksB6N5/DFQ.Ytklzl.LEPxUVjg7zJCGM.gxoNgLOFO','Bart Simpson','1','1644462465551','172.253.248.39'),
('0','dfed2b81e4e2141acffc75256ce51f225a12d28af225f2899eba5492ccdea41f','$2a$10$bvRA8AdbFnvksB6N5/DFQ.Ytklzl.LEPxUVjg7zJCGM.gxoNgLOFO','Bender Rodriguez','1','1644462465551','172.253.248.39'),
('0','807ca06f82415e6d3c152f0ed947b674','$2a$10$bvRA8AdbFnvksB6N5/DFQ.Ytklzl.LEPxUVjg7zJCGM.gxoNgLOFO','Apu Nahasapeemapetilon','1','1644462465551','172.253.248.39'),
('0','bb3f5a7f032c3ace97b0f25d8ae25f76089e01a526665bb6c6bd3ab445743331','$2a$10$bvRA8AdbFnvksB6N5/DFQ.Ytklzl.LEPxUVjg7zJCGM.gxoNgLOFO','Mr. Burns','1','1644462465551','172.253.248.39'),
('0','947b1d7e1274e92b9e2bccd3cefa914c7a8890290a69616210c2f9d2516c7095','$2a$10$bvRA8AdbFnvksB6N5/DFQ.Ytklzl.LEPxUVjg7zJCGM.gxoNgLOFO','Seymour Skinner','1','1644462465551','172.253.248.39'),
('0','9da3e7d0c5e3017db627d0a885ae247e4305c6d39df3a52ff376670ee5fe1e5e','$2a$10$bvRA8AdbFnvksB6N5/DFQ.Ytklzl.LEPxUVjg7zJCGM.gxoNgLOFO','Edna Krapabelle','1','1644462465551','172.253.248.39'),
('0','637148545d513cf7ccdd57841710758ff1064a2c39914824935943f9d818b25f','$2a$10$bvRA8AdbFnvksB6N5/DFQ.Ytklzl.LEPxUVjg7zJCGM.gxoNgLOFO','Krusty le clown','1','1644462465551','172.253.248.39'),
('0','76f4849533aba46a483e284902bad28ea6a3184f4dd8aaea8d5967ca04aa5a4b','$2a$10$bvRA8AdbFnvksB6N5/DFQ.Ytklzl.LEPxUVjg7zJCGM.gxoNgLOFO','Waylon Smithers','1','1644462465551','172.253.248.39'),
('0','20f57550da25f93a3fbb7a31d27625bcc8878b10ee11e3a06b76964c4bd5afa2','$2a$10$bvRA8AdbFnvksB6N5/DFQ.Ytklzl.LEPxUVjg7zJCGM.gxoNgLOFO','Moe Szyslak','1','1644462465551','172.253.248.39'),
('0','847ed20c1b91285c819db58bac85f2090279ff6e6067cb41f486ca6410119a04','$2a$10$bvRA8AdbFnvksB6N5/DFQ.Ytklzl.LEPxUVjg7zJCGM.gxoNgLOFO','Abe Simpson','1','1644462465551','172.253.248.39'),
('0','6ebd114d0dec85a788eb59cc73a35329bfaeedc61386376a533bb8e53aad0ecfcd0466881da1e9a29ef05e3c20e6c49d','$2a$10$bvRA8AdbFnvksB6N5/DFQ.Ytklzl.LEPxUVjg7zJCGM.gxoNgLOFO','Manjula Nahasapeemapetilon','1','1644462465551','172.253.248.39'),
('0','7de7032cd58c9440ecb15317059149da75a9f59d775fbe1ca00e08ee0d469571','$2a$10$bvRA8AdbFnvksB6N5/DFQ.Ytklzl.LEPxUVjg7zJCGM.gxoNgLOFO','Carl Carlson','1','1644462465551','172.253.248.39'),
('0','8130c04e48dbe6822f67c1e81f15d676df04e78dd14fcbf67939d9272bd2536f','$2a$10$bvRA8AdbFnvksB6N5/DFQ.Ytklzl.LEPxUVjg7zJCGM.gxoNgLOFO','AgnesSkinner','1','1644462465551','172.253.248.39'),
('0','27e9cd93441a975cc86da1f0eebc9dabc68aeab1929b8fda3c179e41713d1580','$2a$10$bvRA8AdbFnvksB6N5/DFQ.Ytklzl.LEPxUVjg7zJCGM.gxoNgLOFO','Clancy Wiggum','1','1644462465551','172.253.248.39'),
('0','e405967f6c89ae821ffbd30dee2596854d59cd17b81fbbcf6894754db8f9545b','$2a$10$bvRA8AdbFnvksB6N5/DFQ.Ytklzl.LEPxUVjg7zJCGM.gxoNgLOFO','Elizabeth Hoover','1','1644462465551','172.253.248.39'),
('0','649b603f04febba7f3b76add452c864fcc040b5883bfad499ada12013f940375','$2a$10$bvRA8AdbFnvksB6N5/DFQ.Ytklzl.LEPxUVjg7zJCGM.gxoNgLOFO','Madam Wu','1','1644462465551','172.253.248.39'),
('0','f84bcebc7cf29cf9c8ccfbc4fd20c139e6666356306fcdefa5a0e147928cea06','$2a$10$bvRA8AdbFnvksB6N5/DFQ.Ytklzl.LEPxUVjg7zJCGM.gxoNgLOFO','Ned Flanders','1','1644462465551','172.253.248.39');

INSERT INTO article (id_compte,titre,image,texte,date,upvote,downvote,commentaire,signalement,ip) VALUES
('11','C\'est la fête à Springfield !','1644553230979_11','Krusty le clown va animer votre ville XD','1644553230979','4','0','3','0','172.253.248.39'),
('4','Ce film ennuyeux','1644462481606_4','J\en peux plus, vivement la reprise des cours','1644462481606','1','2','2','0','172.253.248.39'),
('21','Je me souviens de ce moment...','1644462491239_21','Homer, tu y était presque','1644462491239','3','0','4','0','172.253.248.39'),
('5','Impossible à prononselcer','1644462507294_5','','1644462507294','0','1','2','0','172.253.248.39'),
('7','Qui vient dancer ?','1644462516927_7','Hier soir au cabaret avec tous mes amis','1644462516927','4','0','4','0','172.253.248.39'),
('20','','1644462532982_20','','1644462532982','5','0','2','0','172.253.248.39'),
('18','La loi c\'est la LOI !','1644462542615_18','Je ne fait que mon métier','1644462542615','2','2','3','0','172.253.248.39'),
('21','Je me débarrasse des déchets','1644462555459_21','Il faut savoir faire des noeuds','1644462555459','3','0','2','0','172.253.248.39'),
('14','','1644462565092_14','On a trouvé un remède anti-âge','1644462565092','2','1','2','0','172.253.248.39'),
('6','Qui peut faire ça ?','1644462574725_6','','1644462574725','2','0','3','0','172.253.248.39'),
('2','Un des meilleurs moment de ma vie','1644462587569_2','C\'était vraiment délicieux','1644462587569','2','0','1','0','172.253.248.39'),
('2','Comment joindre l\'utile à l\'agréable','1644462593991_2','moins d\'efforts et plus de réconfort','1644462593991','1','1','6','0','172.253.248.39'),
('19','Sauvés par le gong','1644462610046_19','La suite au prochain épisode','1644462610046','1','0','2','0','172.253.248.39'),
('6','On fait un sourire pour la caméra','164446261967_6','pour ma collection','1644462619671','2','0','3','1','172.253.248.39'),
('2','On s\'amuse bien','1644462635734_2','tout en conduisant','1644462635734','1','1','2','0','172.253.248.39');

INSERT INTO commentaire (id_compte,id_article,texte,date,upvote,downvote,signalement,ip) VALUES
('5','1','Trop cool...','1644462471973','1','0','0','172.253.248.39'),
('21','1','Excellente initiative','1644462475184','2','0','0','172.253.248.39'),
('20','1','On passe trop de temps à rire, pas assez à travailler','1644462478395','1','1','0','172.253.248.39'),
('21','2','OUI !','1644462484817','0','0','0','172.253.248.39'),
('18','2','Je me disais la même chose','1644462488028','0','1','0','172.253.248.39'),
('15','3','On a frôlé la catastrophe','1644462494450','0','0','0','172.253.248.39'),
('11','3','Cela aurait pu être drôle','1644462497661','0','1','0','172.253.248.39'),
('10','3','Non merci','1644462500872','0','0','0','172.253.248.39'),
('6','3','J\'aurai tellement aimé voir ça','1644462504083','0','1','0','172.253.248.39'),
('4','4','C\'est pas compliqué : pho-to-syn-thèse','1644462510505','0','0','0','172.253.248.39'),
('19','4','Ah ah il y a du travail','1644462513716','1','0','0','172.253.248.39'),
('10','5','Pas mal','1644462520138','0','0','0','172.253.248.39'),
('2','5','Presque aussi bien que moi','1644462523349','1','0','0','172.253.248.39'),
('14','5','Tout ça me rappelle de vieux souvenirs','1644462526560','0','0','0','172.253.248.39'),
('6','5','Vous appelez ça danser ?','1644462529771','0','1','0','172.253.248.39'),
('5','6','OK','1644462536193','0','0','0','172.253.248.39'),
('18','6','Vous avez raison Mme Wu','1644462539404','1','0','0','172.253.248.39'),
('4','7','Du grand n\'importe quoi','1644462545826','0','0','0','172.253.248.39'),
('12','7','Si on reste dans les clous XD','1644462549037','0','0','0','172.253.248.39'),
('8','7','C\'est bien continuez...','1644462552248','3','0','0','172.253.248.39'),
('13','8','Je fais ça plusieurs fois par jour dans mon restaurant','1644462558670','1','0','0','172.253.248.39'),
('18','8','C\'est souvent nécessaire','1644462561881','1','0','0','172.253.248.39'),
('5','9','Ah ah ah XD','1644462568303','0','0','0','172.253.248.39'),
('6','9','Dommage...','1644462571514','1','0','0','172.253.248.39'),
('14','10','Extraordinaire !','1644462577936','0','0','0','172.253.248.39'),
('9','10','Un miracle de technologie','1644462581147','0','0','0','172.253.248.39'),
('8','10','Intéressant','1644462584358','0','0','0','172.253.248.39'),
('3','11','Tu es notre champion Homer','1644462590780','1','0','0','172.253.248.39'),
('9','12','C\'est ingénieux','1644462597202','0','0','0','172.253.248.39'),
('19','12','Bien trouvé !','1644462600413','0','0','0','172.253.248.39'),
('6','12','nul','1644462604624','0','1','0','172.253.248.39'),
('6','12','nul','1644462605624','0','0','1','172.253.248.39'),
('6','12','nul','1644462606624','0','0','1','172.253.248.39'),
('6','12','nul','1644462607624','0','0','1','172.253.248.39'),
('7','13','Il y a un moment à tout','1644462613257','0','0','0','172.253.248.39'),
('17','13','C\'est la récréation','1644462616468','0','0','0','172.253.248.39'),
('5','14','On fait tous un sourire','1644462626101','0','0','0','172.253.248.39'),
('13','14','Excellent !','1644462629312','0','0','0','172.253.248.39'),
('14','14','Tu sais utiliser ça Blender ?','1644462632523','0','0','0','172.253.248.39'),
('6','15','Et la sécurité ?','1644462638945','1','0','0','172.253.248.39'),
('8','15','Très bonne idée','1644462642156','0','0','0','172.253.248.39');

INSERT INTO vote_article (id_compte,id_article,vote) VALUES
('7','1','1'),
('15','1','1'),
('8','1','1'),
('2','1','1'),
('9','2','1'),
('20','2','0'),
('12','2','0'),
('15','3','1'),
('2','3','1'),
('5','3','1'),
('4','4','0'),
('8','5','1'),
('9','5','1'),
('1','5','1'),
('13','5','1'),
('8','6','1'),
('9','6','1'),
('2','6','1'),
('16','6','1'),
('15','6','1'),
('19','7','1'),
('17','7','1'),
('21','7','0'),
('4','7','0'),
('12','8','1'),
('2','8','1'),
('14','8','1'),
('20','8','1'),
('4','9','1'),
('6','9','1'),
('18','9','0'),
('5','10','1'),
('7','10','1'),
('4','11','1'),
('19','11','1'),
('9','12','1'),
('17','12','0'),
('8','13','1'),
('19','14','1'),
('13','14','1'),
('1','6','1'),
('1','2','0'),
('1','9','1');

INSERT INTO vote_commentaire (id_compte,id_commentaire,vote) VALUES
('2','1','1'),
('9','2','1'),
('12','2','1'),
('21','3','0'),
('19','5','1'),
('4','9','0'),
('11','11','1'),
('17','13','1'),
('3','15','0'),
('4','6','1'),
('19','6','1'),
('21','6','1'),
('2','6','1'),
('7','17','1'),
('14','6','1'),
('5','18','1'),
('19','20','1'),
('10','20','1'),
('18','20','1'),
('9','21','1'),
('9','22','1'),
('5','24','0'),
('18','28','1'),
('9','32','0'),
('6','40','1');

INSERT INTO signalement (id_article,id_commentaire,motif,date,id_compte) VALUES
('12','32','3','1644462606835','5'),
('12','33','3','1644462608835','9'),
('12','34','3','1644462609835','5'),
('14','0','4','1644462622890','12');

