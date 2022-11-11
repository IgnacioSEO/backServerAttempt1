-- migrate:up
CREATE TABLE posts (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    content VARCHAR(3000) NOT NULL,
    contentImage VARCHAR(1000) NOT NULL,
    userId INT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT posts_user_id_fkey FOREIGN KEY (userId) REFERENCES users(id)
);
-- migrate:down
DROP TABLE posts
