FROM livekit/livekit-server:latest

# Copy the configuration file
COPY livekit.yaml /etc/livekit.yaml

# Expose ports
EXPOSE 7880 7881 7882 3478 5349

# Use the config file
CMD ["--config", "/etc/livekit.yaml"]
