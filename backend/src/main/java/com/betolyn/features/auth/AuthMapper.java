package com.betolyn.features.auth;

import com.betolyn.features.auth.dto.JwtSessionDTO;
import com.betolyn.features.auth.signin.SignInResponseDTO;
import com.betolyn.features.user.UserDTO;
import com.betolyn.features.user.UserEntity;
import com.betolyn.shared.BaseMapperConfig;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.springframework.stereotype.Component;

@Component
@Mapper(config = BaseMapperConfig.class)
public interface AuthMapper {
    UserDTO toSignUpResponse(UserEntity user);

    // Maps the session result to the full Sign In response
    @Mapping(source = "userId", target = "user.id")
    @Mapping(source = "username", target = "user.username")
    @Mapping(source = "email", target = "user.email")
    SignInResponseDTO toSignInResponse(JwtSessionDTO session);
}