package com.genz.translator.repository;

import com.genz.translator.model.Term;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface TermRepository extends JpaRepository<Term, Long> {
    Optional<Term> findByGenzTextIgnoreCase(String genzText);
    
    List<Term> findByCategory(String category);
    
    @Query("SELECT t FROM Term t ORDER BY t.popularityScore DESC")
    List<Term> findAllByPopularityDesc();
    
    @Query("SELECT t FROM Term t WHERE LOWER(t.genzText) LIKE LOWER(CONCAT('%', ?1, '%')) OR LOWER(t.translation) LIKE LOWER(CONCAT('%', ?1, '%'))")
    List<Term> findBySearchTerm(String searchTerm);
}