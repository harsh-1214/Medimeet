"use client"

import React from "react";

function ErrorPage({err} : {err : any}) {
  return (
    <div style = {styles.container}>
      <h1 style={styles.heading}>Oops!</h1>
      <p style={styles.subheading}>{err?.message}</p>
      <div style={styles.actions}>
        <button style={styles.button} onClick={() => window.location.reload()}>
          Try Again
        </button>
        <a href="/" style={styles.link}>Go Home</a>
      </div>
      <p style={styles.errorCode}>Error Code: {500}</p>
    </div>
  );
}

const styles = {
  container: {
    // textAlign: "center",
    padding: "50px",
    fontFamily: "Arial, sans-serif",
    color: "#333",
  },
  heading: {
    fontSize: "3rem",
    marginBottom: "10px",
    color: "#0070f3",
  },
  subheading: {
    fontSize: "1.2rem",
    marginBottom: "20px",
  },
  actions: {
    marginTop: "20px",
  },
  button: {
    backgroundColor: "#0070f3",
    color: "#fff",
    border: "none",
    padding: "10px 20px",
    marginRight: "10px",
    borderRadius: "5px",
    cursor: "pointer",
  },
  link: {
    margin: "0 10px",
    color: "#0070f3",
    textDecoration: "none",
  },
  errorCode: {
    marginTop: "30px",
    fontSize: "0.9rem",
    color: "#666",
  },
};

export default ErrorPage;
