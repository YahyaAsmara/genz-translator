package com.genz.translator.repository;

import com.genz.translator.model.TranslationHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TranslationHistoryRepository extends JpaRepository<TranslationHistory, Long> {
    @Query("SELECT th FROM TranslationHistory th ORDER BY th.createdAt DESC")
    List<TranslationHistory> findAllByCreatedAtDesc();
    
    @Query(value = "SELECT * FROM translation_history ORDER BY created_at DESC LIMIT ?1", nativeQuery = true)
    List<TranslationHistory> findRecentTranslations(int limit);
}