{{/* vim: set filetype=mustache: */}}
{{/*
Expand the name of the chart.
*/}}
{{- define "smile.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create a default fully qualified app name.
We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
If release name contains chart name it will be used as a full name.
*/}}
{{- define "smile.fullname" -}}
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
{{- define "smile.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Common labels
*/}}
{{- define "smile.labels" -}}
helm.sh/chart: {{ include "smile.chart" . }}
{{ include "smile.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{/*
Selector labels
*/}}
{{- define "smile.selectorLabels" -}}
app.kubernetes.io/name: {{ include "smile.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{/*
Create the name of the service account to use
*/}}
{{- define "smile.serviceAccountName" -}}
{{- if .Values.serviceAccount.create }}
{{- default (include "smile.fullname" .) .Values.serviceAccount.name }}
{{- else }}
{{- default "default" .Values.serviceAccount.name }}
{{- end }}
{{- end }}

{{/*
Add environment variables to talk to minio
*/}}
{{- define "smile.minio.connect" -}}
- name: MINIO_URL
  value: {{ include "smile.fullname" . }}-minio
- name: MINIO_PUBLIC_ACCESS_URL
  value: "https://{{ .Values.minio.apiIngress.hostname }}"
- name: AWS_ACCESSKEY
  valueFrom:
    secretKeyRef:
      {{- if .Values.externalsecrets }}
      name: {{ .Values.externalsecrets }}
      {{- else }}
      name: {{ include "smile.fullname" . }}-server
      {{- end }}
      key: root-user
- name: AWS_ACCESSKEYSECRET
  valueFrom:
    secretKeyRef:
      {{- if .Values.externalsecrets }}
      name: {{ .Values.externalsecrets }}
      {{- else }}
      name: {{ include "smile.fullname" . }}-server
      {{- end }}
      key: root-password
- name: BUCKET_NAME
  value: {{ .Values.minio.defaultBuckets }}
{{- end }}

{{/*
Add environment variables to talk to minio
*/}}
{{- define "smile.email.connect" -}}
- name: EMAIL_HOST
  value: "smtp.ncsa.illinois.edu"
- name: EMAIL_PORT
  value: "25"
- name: EMAIL_FROM_ADDRESS
  value: "devnull+smm@ncsa.illinois.edu"
- name: EMAIL_PASSWORD
  value: ""
{{- end }}
