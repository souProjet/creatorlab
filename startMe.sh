#bin/sh
# Create or restart the node on the server

# 1. get the process pid by executing command pm2 pid creatorlab
pid=$(echo $(pm2 pid creatorlab))

echo "Process pid: $pid"

# 2. check pid is not null
if [ -z "$pid" ]; then
  # 3. if pid is null, then create the node
  pm2 start main.js --name="creatorlab"
  echo "Node is created"
else
  # 4. if pid is not null, then restart the node
  pm2 restart creatorlab
  echo "Node is restarted"
fi