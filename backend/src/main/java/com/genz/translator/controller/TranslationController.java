package com.genz.translator.controller;

import com.genz.translator.dto.TranslationRequest;
import com.genz.translator.dto.TranslationResponse;
import com.genz.translator.model.Term;
import com.genz.translator.model.TranslationHistory;
import com.genz.translator.service.TranslationService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = {"http://localhost:3000", "http://frontend:3000"})
public class TranslationController {

    @Autowired
    private TranslationService translationService;

    @PostMapping("/translate")
    public ResponseEntity<TranslationResponse> translate(@Valid @RequestBody TranslationRequest request) {
        TranslationResponse response = translationService.translateText(request.getText());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/translate")
    public ResponseEntity<TranslationResponse> translateGet(@RequestParam String text) {
        TranslationResponse response = translationService.translateText(text);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/terms")
    public ResponseEntity<List<Term>> getAllTerms() {
        List<Term> terms = translationService.getAllTerms();
        return ResponseEntity.ok(terms);
    }

    @GetMapping("/terms/popular")
    public ResponseEntity<List<Term>> getPopularTerms() {
        List<Term> terms = translationService.getPopularTerms();
        return ResponseEntity.ok(terms);
    }

    @PostMapping("/terms")
    public ResponseEntity<Term> addTerm(@Valid @RequestBody Term term) {
        Term savedTerm = translationService.addTerm(term);
        return ResponseEntity.ok(savedTerm);
    }

    @GetMapping("/terms/search")
    public ResponseEntity<List<Term>> searchTerms(@RequestParam String query) {
        List<Term> terms = translationService.searchTerms(query);
        return ResponseEntity.ok(terms);
    }

    @GetMapping("/history")
    public ResponseEntity<List<TranslationHistory>> getTranslationHistory(@RequestParam(defaultValue = "10") int limit) {
        List<TranslationHistory> history = translationService.getRecentTranslations(limit);
        return ResponseEntity.ok(history);
    }

    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Gen Z Translator API is running! 🚀");
    }
}