#!/bin/bash

# Install .NET SDK for Linux
wget https://dot.net/v1/dotnet-install.sh
chmod +x dotnet-install.sh
./dotnet-install.sh --channel 9.0
export PATH=$PATH:$HOME/.dotnet

# Verify installation
$HOME/.dotnet/dotnet --version

# Add to PATH permanently
echo 'export PATH=$PATH:$HOME/.dotnet' >> ~/.bashrc
echo '.NET SDK has been installed. Please restart your terminal or run: source ~/.bashrc'