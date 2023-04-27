import React from 'react';
import styles from './ZoomLink.module.scss';

export default function ZoomLink({ link }) {
  return (
    <div className={styles.card}>
      <div className={styles.card_icon}>
        <i className="fas fa-video"></i>
      </div>
      <div className={styles.card_body}>
        <div className={styles.card_header}>
          <h3>Your next class starts in less than 10 minutes</h3>
          <p>Please click the link below to join the Zoom class</p>
        </div>
        <div className={styles.card_link_body}>
          <a
            href={link}
            target="_blank"
            rel="noreferrer"
            className={styles.card_link}
          >
            <i className="fas fa-link"></i>
            {link}
          </a>
        </div>
      </div>
    </div>
  );
}
