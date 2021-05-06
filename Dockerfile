# Build stage
FROM mcr.microsoft.com/dotnet/sdk:5.0 as build

# Install NodeJS and NPM
RUN apt-get update -yq && apt-get upgrade -yq && apt-get install -yq curl git nano
RUN curl -sL https://deb.nodesource.com/setup_12.x | bash - && apt-get install -yq nodejs build-essential

# Copy the files from the file system so they can built
COPY ./ /src
WORKDIR /src

# Install node
RUN npm install -g npm
RUN npm --version

# Opt out of .NET Core's telemetry collection
ENV DOTNET_CLI_TELEMETRY_OPTOUT 1

# Set node to production
ENV NODE_ENV production

# Run the publish command, which also runs the required NPM commands to build the React front-end
RUN dotnet publish -c Release

# Run stage
FROM mcr.microsoft.com/dotnet/aspnet:5.0 as run

ENV DOTNET_CLI_TELEMETRY_OPTOUT 1

EXPOSE 9015/tcp
ENV ASPNETCORE_URLS http://*:9015

COPY --from=build /src/bin/Release/net5.0/publish /app
WORKDIR /app

ENTRYPOINT ["dotnet", "Restaurant-Picker.dll"]