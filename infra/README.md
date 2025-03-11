# Infrastruktur für DreamSync

Diese Infrastruktur verwendet Terraform, um eine statische Website auf AWS S3 bereitzustellen.

## Voraussetzungen

- Terraform (mindestens Version 1.x)
- AWS CLI und AWS-Zugangsdaten (Access Key ID und Secret Access Key)
- Ein AWS-Konto

## Setup und Nutzung

1. **Terraform initialisieren**

   Führe den folgenden Befehl aus, um Terraform im Verzeichnis zu initialisieren:

   ```bash
   terraform init
   ```

2. **Variablen anpassen**

   Bearbeite die `variables.tf`-Datei oder stelle die Variablen in deiner Umgebung ein:

   - `aws_region`: Die AWS-Region, in der die Infrastruktur bereitgestellt wird (z. B. `eu-central-1`).
   - `bucket_name`: Der Name des S3-Buckets, in dem die Website gehostet wird.

3. **Planung der Bereitstellung**

   Stelle sicher, dass deine Terraform-Konfigurationen korrekt sind und führe den folgenden Befehl aus, um den Bereitstellungsplan zu überprüfen:

   ```bash
   terraform plan
   ```

4. **Bereitstellung**

   Nachdem du den Plan überprüft hast, führe den folgenden Befehl aus, um die Infrastruktur bereitzustellen:

   ```bash
   terraform apply
   ```

   Bestätige mit `yes`, um fortzufahren.

5. **Website-URL**

   Sobald die Bereitstellung abgeschlossen ist, kannst du deine statische Website unter der URL des S3-Buckets aufrufen. Die URL wird wie folgt gebildet:

   ```
   http://<bucket-name>.s3-website-<aws-region>.amazonaws.com
   ```

6. **Hochladen der index.html**

   Terraform kümmert sich um das Hochladen der `index.html`-Datei in den S3-Bucket. Stelle sicher, dass sich die Datei im Verzeichnis `../app/index.html` befindet, oder passe den Pfad im Terraform-Skript an.

## Weitere Anmerkungen

- Diese Infrastruktur blockiert den öffentlichen Zugriff auf den S3-Bucket und stellt eine Bucket-Policy ein, um nur den Lesezugriff auf die `index.html` zu ermöglichen.
- Falls du andere Dateien oder Assets hochladen möchtest, musst du die `aws_s3_object`-Ressource in `main.tf` erweitern.
