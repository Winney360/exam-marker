use axum::{
    Router,
    routing::{get, post},
};
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

mod config;
mod db;
mod models;
mod repositories;
mod routes;
mod services;

use config::Config;
use db::DbPool;

#[derive(Clone)]
pub struct AppState {
    pub db: DbPool,
}

#[tokio::main]
async fn main() {
    tracing_subscriber::registry()
        .with(tracing_subscriber::fmt::layer())
        .init();

    let config = Config::from_env();

    let db = db::create_pool(&config.database_url)
        .await
        .expect("failed to create database pool");

    db::run_migrations(&db)
        .await
        .expect("failed to run migrations");

    let state = AppState { db };

    let addr = format!("{}:{}", config.server_addr, config.server_port);

    let app = Router::new()
        .route("/health", get(routes::health::health_check))
        .route("/assessments", post(routes::assessments::create_assessment))
        .with_state(state);

    let listener = tokio::net::TcpListener::bind(&addr)
        .await
        .expect("failed to bind server");

    tracing::info!("listening on {}", addr);
    axum::serve(listener, app).await.expect("server failed");
}
