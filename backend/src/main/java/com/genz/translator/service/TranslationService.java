package com.genz.translator.service;

import com.genz.translator.dto.TranslationResponse;
import com.genz.translator.model.Term;
import com.genz.translator.model.TranslationHistory;
import com.genz.translator.repository.TermRepository;
import com.genz.translator.repository.TranslationHistoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

@Service
public class TranslationService {

    @Autowired
    private TermRepository termRepository;

    @Autowired
    private TranslationHistoryRepository translationHistoryRepository;

    public TranslationResponse translateText(String originalText) {
        String translatedText = originalText;
        List<String> termsFound = new ArrayList<>();

        // Get all terms from database
        List<Term> allTerms = termRepository.findAll();

        // Replace Gen Z terms with translations
        for (Term term : allTerms) {
            String genzText = term.getGenzText();
            String translation = term.getTranslation();

            // Create regex pattern for word boundaries
            Pattern pattern = Pattern.compile("\\b" + Pattern.quote(genzText) + "\\b", Pattern.CASE_INSENSITIVE);
            
            if (pattern.matcher(translatedText).find()) {
                translatedText = pattern.matcher(translatedText).replaceAll(translation);
                termsFound.add(genzText);
                
                // Increase popularity score
                term.setPopularityScore(term.getPopularityScore() + 1);
                termRepository.save(term);
            }
        }

        // Capitalize first letter
        if (!translatedText.isEmpty()) {
            translatedText = translatedText.substring(0, 1).toUpperCase() + 
                           (translatedText.length() > 1 ? translatedText.substring(1) : "");
        }

        // Save translation history
        TranslationHistory history = new TranslationHistory(originalText, translatedText);
        translationHistoryRepository.save(history);

        return new TranslationResponse(originalText, translatedText, termsFound);
    }

    public List<Term> getAllTerms() {
        return termRepository.findAll();
    }

    public List<Term> getPopularTerms() {
        return termRepository.findAllByPopularityDesc();
    }

    public Term addTerm(Term term) {
        return termRepository.save(term);
    }

    public List<TranslationHistory> getRecentTranslations(int limit) {
        return translationHistoryRepository.findRecentTranslations(limit);
    }

    public List<Term> searchTerms(String query) {
        return termRepository.findBySearchTerm(query);
    }
}