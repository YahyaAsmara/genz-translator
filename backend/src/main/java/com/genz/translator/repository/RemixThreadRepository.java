package com.genz.translator.repository;

import com.genz.translator.model.community.RemixThread;
import com.genz.translator.model.community.VibePost;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RemixThreadRepository extends JpaRepository<RemixThread, Long> {
    List<RemixThread> findByVibePostOrderByCreatedAtAsc(VibePost vibePost);
}
