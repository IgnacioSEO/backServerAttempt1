-- migrate:up
CREATE TABLE likes (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    userId INT NOT NULL,
    postId INT NOT NULL,
    CONSTRAINT likes_userId_fkey FOREIGN KEY (userId) REFERENCES users(id),
    CONSTRAINT likes_postId_fkey FOREIGN KEY (postId) REFERENCES posts(id),
    CONSTRAINT likes_userId_postId_unq UNIQUE (userId, postId)
);
-- migrate:down
DROP TABLE likes
