{{/*
ResidentCement Helm Chart - Common Helper Templates
*/}}

{{/*
Expand the name of the chart.
*/}}
{{- define "resident-cement.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create a default fully qualified app name.
We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
If release name contains chart name it will be used as a full name.
*/}}
{{- define "resident-cement.fullname" -}}
{{- if .Values.fullnameOverride }}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- $name := default .Chart.Name .Values.nameOverride }}
{{- if contains $name .Release.Name }}
{{- .Release.Name | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}
{{- end }}

{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "resident-cement.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Common labels
*/}}
{{- define "resident-cement.labels" -}}
helm.sh/chart: {{ include "resident-cement.chart" . }}
{{ include "resident-cement.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{/*
Selector labels
*/}}
{{- define "resident-cement.selectorLabels" -}}
app.kubernetes.io/name: {{ include "resident-cement.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{/*
Create the name of the service account to use
*/}}
{{- define "resident-cement.serviceAccountName" -}}
{{- if .Values.microservices.serviceAccount.create }}
{{- default (include "resident-cement.fullname" .) .Values.microservices.serviceAccount.name }}
{{- else }}
{{- default "default" .Values.microservices.serviceAccount.name }}
{{- end }}
{{- end }}

{{/*
Gateway service name
*/}}
{{- define "resident-cement.gateway.fullname" -}}
{{- printf "%s-gateway" (include "resident-cement.fullname" .) | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Frontend service name
*/}}
{{- define "resident-cement.frontend.fullname" -}}
{{- printf "%s-frontend" (include "resident-cement.fullname" .) | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Admin Dashboard service name
*/}}
{{- define "resident-cement.admin-dashboard.fullname" -}}
{{- printf "%s-admin-dashboard" (include "resident-cement.fullname" .) | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Service fullname helper
*/}}
{{- define "resident-cement.service.fullname" -}}
{{- $serviceName := index . 0 }}
{{- $root := index . 1 }}
{{- printf "%s-%s" (include "resident-cement.fullname" $root) $serviceName | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Image repository helper
*/}}
{{- define "resident-cement.image.repository" -}}
{{- $image := index . 0 }}
{{- $root := index . 1 }}
{{- $global := $root.Values.global }}
{{- $ms := $root.Values.microservices }}
{{- $registry := $global.imageRegistry | default "" }}
{{- $prefix := $ms.image.repositoryPrefix | default "resident-cement" }}
{{- $repo := $image.repository }}
{{- if $registry }}
{{- printf "%s/%s/%s" $registry $prefix $repo }}
{{- else }}
{{- printf "%s/%s" $prefix $repo }}
{{- end }}
{{- end }}

{{/*
Image tag helper
*/}}
{{- define "resident-cement.image.tag" -}}
{{- $image := index . 0 }}
{{- $root := index . 1 }}
{{- $ms := $root.Values.microservices }}
{{- $image.tag | default $ms.image.tag | default "latest" }}
{{- end }}

{{/*
Database URL helper
*/}}
{{- define "resident-cement.database.url" -}}
{{- $db := .Values.postgresql }}
{{- $password := $db.auth.password | default (include "resident-cement.secrets.dbPassword" .) }}
{{- printf "postgresql://%s:%s@%s-postgresql:5432/%s" $db.auth.username $password (include "resident-cement.fullname" .) $db.auth.database }}
{{- end }}

{{/*
MongoDB URI helper
*/}}
{{- define "resident-cement.mongodb.uri" -}}
{{- $mongo := .Values.mongodb }}
{{- $password := $mongo.auth.rootPassword | default (include "resident-cement.secrets.mongoPassword" .) }}
{{- printf "mongodb://%s:%s@%s-mongodb:27017/%s?authSource=admin" $mongo.auth.rootUser $password (include "resident-cement.fullname" .) $mongo.auth.database }}
{{- end }}

{{/*
Redis URL helper
*/}}
{{- define "resident-cement.redis.url" -}}
{{- $redis := .Values.redis }}
{{- $password := $redis.auth.password | default (include "resident-cement.secrets.redisPassword" .) }}
{{- printf "redis://:%s@%s-redis-master:6379" $password (include "resident-cement.fullname" .) }}
{{- end }}

{{/*
Kafka brokers helper
*/}}
{{- define "resident-cement.kafka.brokers" -}}
{{- printf "%s-kafka:9092" (include "resident-cement.fullname" .) }}
{{- end }}

{{/*
Secrets helpers
*/}}
{{- define "resident-cement.secrets.name" -}}
{{- if .Values.vault.enabled }}
{{- printf "%s-app-secrets" (include "resident-cement.fullname" .) }}
{{- else }}
{{- printf "%s-secrets" (include "resident-cement.fullname" .) }}
{{- end }}
{{- end }}

{{- define "resident-cement.secrets.dbPassword" -}}
{{- .Values.secrets.dbPassword | default (randAlphaNum 32) }}
{{- end }}

{{- define "resident-cement.secrets.mongoPassword" -}}
{{- .Values.secrets.mongoPassword | default (randAlphaNum 32) }}
{{- end }}

{{- define "resident-cement.secrets.redisPassword" -}}
{{- .Values.secrets.redisPassword | default (randAlphaNum 32) }}
{{- end }}

{{- define "resident-cement.secrets.jwtSecret" -}}
{{- .Values.secrets.jwtSecret | default (randAlphaNum 64) }}
{{- end }}

{{- define "resident-cement.secrets.apiKey" -}}
{{- .Values.secrets.apiKey | default (randAlphaNum 64) }}
{{- end }}
