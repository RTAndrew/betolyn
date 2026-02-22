package com.betolyn.features.auth.getauthenticateduser;

import com.betolyn.features.auth.JwtSessionDTO;
import com.betolyn.features.user.UserEntity;

public record AuthenticatedUserDTO(UserEntity user, JwtSessionDTO session){}