FROM node:10-alpine as build-node
WORKDIR /ClientApp
COPY ClientApp/package.json .
COPY ClientApp/package-lock.json .
RUN npm install
COPY ClientApp/ . 
RUN npm run build 


FROM mcr.microsoft.com/dotnet/core/sdk:3.0 AS build-env
ENV BuildingDocker true
WORKDIR /app

# Copy csproj and restore as distinct layers
COPY *.csproj ./
RUN dotnet restore

# Copy everything else and build
COPY . ./
RUN dotnet publish -c Release -o out

# Build runtime image
FROM mcr.microsoft.com/dotnet/core/aspnet:3.0
WORKDIR /app
COPY --from=build-env /app/out .
ENTRYPOINT ["dotnet", "aspnetapp.dll"]