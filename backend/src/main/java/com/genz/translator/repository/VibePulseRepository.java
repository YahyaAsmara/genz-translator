package com.genz.translator.repository;

import com.genz.translator.model.UserAccount;
import com.genz.translator.model.community.PulseType;
import com.genz.translator.model.community.VibePost;
import com.genz.translator.model.community.VibePulse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VibePulseRepository extends JpaRepository<VibePulse, Long> {
    Optional<VibePulse> findByVibePostAndUserAndPulseType(VibePost post, UserAccount user, PulseType type);
    List<VibePulse> findByVibePost(VibePost post);
}
