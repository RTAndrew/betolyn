package com.betolyn.config.database;

import com.betolyn.features.user.UserEntity;
import com.betolyn.features.auth.dto.JwtSessionDTO;
import org.springframework.data.domain.AuditorAware;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Objects;
import java.util.Optional;

/** Configures the Spring JPA Auditing to access the current logged user
 * and be able to utilized it on @createdBy, @lastModifiedBy
 * @link <a href="https://medium.com/programmingmitra-com/spring-data-jpa-auditing-saving-createdby-createddate-lastmodifiedby-lastmodifieddate-c2d64c42998e">Programmingmitra</a>
 * @link <a href="https://hantsy.blogspot.com/2013/10/jpa-data-auditing.html">Hantsy</a>
 * @link <a href="https://www.springbyexample.org/examples/spring-data-jpa-auditing-code-example.html">SpringByExample</a>
 * @link <a href="https://medium.com/@vasundhara.snv/implementing-audit-aware-functionality-in-spring-data-jpa-a2c338c12fab">Vasundhara</a>
 * */
public class AuditorAwareImpl implements AuditorAware<UserEntity> {

    @Override
    public Optional<UserEntity> getCurrentAuditor() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (Objects.isNull(authentication)) {
            return Optional.empty();
        }

        if (authentication.getPrincipal() instanceof JwtSessionDTO jwtUser) {
            var user = new UserEntity();
            user.setId(jwtUser.getUserId());
            user.setUsername(jwtUser.getUsername());
            user.setEmail(jwtUser.getEmail());

            return Optional.of(user);
        }

        return Optional.empty();
    }

}