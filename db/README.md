# Running the Database with Docker

## Step 1: Install Docker

- First, ensure that Docker is installed. To verify if Docker is installed on your machine, use the following command:

```
docker -v
```

## Step 2: Build the Docker Image

- Navigate to the `db` folder in your terminal
- Run the following command to build the Docker image:

```
docker build -t db .
```

- Verify that the image has been created using:

```
docker images
```

You should see a repository named `db` in the list.

## Step 3: Create and Start the Docker Container

- Use the following command to create and start the container:

```
docker run -d --name mysql-container -v mysql_data:/var/lib/mysql -p 3306:3306 db
```

This command:

- Creates a container name `mysql-container`
- Sets up a volume name `mysql_data` for storing the data in the tables
- Exposes port `3306` to access the MySQL server at `localhost:3306`

## Step 4: Manage the Docker Container

- Use the Docker desktop application to view images, container, and volumes. You can also start, stop containers, and view logs through it.
- To stop the container:

1.  List all running containers with:
    ```
    docker container ls
    ```
2.  Find the container with `IMAGE db` and note the `CONTAINER ID`
3.  Use the following command to stop the contaienr:
    ```
    docker container stop [container-id]
    ```

- To start the container:

1.  List all container including stopped ones with:
    ```
    docker container ls -a
    ```
2.  Start the container using its `CONTAINER ID`:
    ```
    docker container start [container-id]
    ```

## Step 4: Log in to the MySQL Server

- Use the following credentials to log into the MySQL server:
  - Username: `root`
  - Password: `nobugs`
