use axum::{
    Router,
    routing::{get, post},
};
use tower_http::cors::CorsLayer;
use tower_http::trace::TraceLayer;
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

mod config;
mod db;
mod error;
mod models;
mod repositories;
mod routes;
mod services;

use config::Config;
use db::DbPool;
use services::ocr_client::OcrClient;

#[derive(Clone)]
pub struct AppState {
    pub db: DbPool,
    pub config: Config,
    pub ocr: OcrClient,
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

    tokio::fs::create_dir_all(&config.upload_dir)
        .await
        .expect("failed to create upload directory");

    let ocr = OcrClient::new(config.ocr_service_url.clone());

    let state = AppState {
        db,
        config: config.clone(),
        ocr,
    };

    let addr = format!("{}:{}", config.server_addr, config.server_port);

    let cors = CorsLayer::permissive();

    let app = Router::new()
        .route("/health", get(routes::health::health_check))
        .route("/assessments", post(routes::assessments::create_assessment))
        .route("/assessments/{id}", get(routes::assessments::get_assessment))
        .route(
            "/assessments/{id}/scripts",
            post(routes::scripts::upload_script),
        )
        .route(
            "/assessments/{id}/questions",
            get(routes::questions::list_questions).post(routes::questions::create_question),
        )
        .route(
            "/assessments/{assessment_id}/questions/{question_id}",
            axum::routing::put(routes::questions::update_question)
                .delete(routes::questions::delete_question),
        )
        .route(
            "/scripts/{id}/process",
            post(routes::process::process_script),
        )
        .route("/scripts/{id}/mark", post(routes::marking::mark_script))
        .layer(cors)
        .layer(TraceLayer::new_for_http())
        .with_state(state);

    let listener = tokio::net::TcpListener::bind(&addr)
        .await
        .expect("failed to bind server");

    tracing::info!("listening on {}", addr);
    axum::serve(listener, app).await.expect("server failed");
}
