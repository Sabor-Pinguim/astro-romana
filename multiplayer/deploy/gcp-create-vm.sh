#!/usr/bin/env bash
# Creates the GCP pieces for the game + room server: a static IP, a firewall rule for HTTP/HTTPS and a Debian VM.
# Run it in Cloud Shell (or anywhere with gcloud logged in to the project). Safe to run again: existing pieces are kept.
#   bash gcp-create-vm.sh
#   NAME=astro-test MACHINE=e2-small bash gcp-create-vm.sh
set -euo pipefail

NAME=${NAME:-astro-romana}
REGION=${REGION:-southamerica-east1}   # São Paulo
ZONE=${ZONE:-$REGION-a}
MACHINE=${MACHINE:-e2-small}           # 2 vCPU (shared), 2 GB; e2-micro also works
IMAGE_FAMILY=${IMAGE_FAMILY:-debian-13}
TAG=${TAG:-astro-romana-web}

project=$(gcloud config get-value project 2>/dev/null)
[ -n "$project" ] || { echo "No project selected: gcloud config set project <id>" >&2; exit 1; }
echo "Project $project · VM $NAME ($MACHINE) in $ZONE"

gcloud services enable compute.googleapis.com

if ! gcloud compute addresses describe "$NAME-ip" --region "$REGION" >/dev/null 2>&1; then
  gcloud compute addresses create "$NAME-ip" --region "$REGION"
fi
ip=$(gcloud compute addresses describe "$NAME-ip" --region "$REGION" --format='value(address)')

# 80 for the certificate challenge and the redirect, 443 TCP for HTTPS/WebSocket, 443 UDP for HTTP/3.
if ! gcloud compute firewall-rules describe "$TAG" >/dev/null 2>&1; then
  gcloud compute firewall-rules create "$TAG" --network default --direction INGRESS \
    --allow tcp:80,tcp:443,udp:443 --target-tags "$TAG" --description "Astro Romana: Caddy (HTTP/HTTPS)"
fi

if ! gcloud compute images describe-from-family "$IMAGE_FAMILY" --project debian-cloud >/dev/null 2>&1; then
  echo "Image family $IMAGE_FAMILY not found; using debian-12."; IMAGE_FAMILY=debian-12
fi
if ! gcloud compute instances describe "$NAME" --zone "$ZONE" >/dev/null 2>&1; then
  gcloud compute instances create "$NAME" --zone "$ZONE" --machine-type "$MACHINE" \
    --image-family "$IMAGE_FAMILY" --image-project debian-cloud --boot-disk-size 20GB \
    --address "$ip" --tags "$TAG"
fi

cat <<EOF

VM ready. External IP: $ip
Without a domain of your own, the site will be https://${ip//./-}.sslip.io
With a domain, point an A record to $ip before running setup.sh.

Next: open an SSH session (gcloud compute ssh $NAME --zone $ZONE, or the SSH button in the console),
upload multiplayer/deploy/setup.sh and run: sudo bash setup.sh [domain] [email]
EOF
