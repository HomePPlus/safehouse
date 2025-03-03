package com.safehouse.domain.user.repository;

import com.safehouse.domain.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    boolean existsByRole(String role);
    Optional<User> findByUserNameAndPhone(String userName, String phone);
}
