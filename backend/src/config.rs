use std::env;

#[derive(Clone)]
pub struct Config {
    pub database_url: String,
    pub server_addr: String,
    pub server_port: u16,
    pub upload_dir: String,
}

impl Config {
    pub fn from_env() -> Self {
        let database_url = env::var("DATABASE_URL")
            .unwrap_or_else(|_| "postgres://postgres:postgres@localhost:5432/exammark".to_string());

        let server_addr = env::var("SERVER_ADDR").unwrap_or_else(|_| "127.0.0.1".to_string());
        let server_port = env::var("SERVER_PORT")
            .ok()
            .and_then(|p| p.parse().ok())
            .unwrap_or(3000);

        let upload_dir = env::var("UPLOAD_DIR").unwrap_or_else(|_| "uploads".to_string());

        Config {
            database_url,
            server_addr,
            server_port,
            upload_dir,
        }
    }
}
