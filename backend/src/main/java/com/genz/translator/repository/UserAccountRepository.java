package com.genz.translator.repository;

import com.genz.translator.model.UserAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserAccountRepository extends JpaRepository<UserAccount, Long> {
    Optional<UserAccount> findByEmailIgnoreCase(String email);
    Optional<UserAccount> findByHandleIgnoreCase(String handle);
    boolean existsByEmailIgnoreCase(String email);
    boolean existsByHandleIgnoreCase(String handle);
}
