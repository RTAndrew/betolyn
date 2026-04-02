package com.betolyn.features.me;

import com.betolyn.features.auth.AuthMapper;
import com.betolyn.features.auth.getauthenticateduser.GetAuthenticatedUserUC;
import com.betolyn.features.bankroll.account.findaccountbyownerid.FindAccountByOwnerIdUC;
import com.betolyn.features.user.UserDTO;
import com.betolyn.shared.exceptions.AccessForbiddenException;
import com.betolyn.utils.responses.ApiResponse;
import lombok.Builder;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.BadRequestException;
import org.jetbrains.annotations.NotNull;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;

@Builder
record BalanceDTO(BigDecimal available, BigDecimal reserved) {
}

record MeDTO(
        UserDTO user,
        String token,
        String sessionId,
        BalanceDTO balance
) {
}

@RestController
@RequiredArgsConstructor
public class Me {
    private final GetAuthenticatedUserUC getAuthenticatedUserUC;
    private final AuthMapper authMapper;
    private final FindAccountByOwnerIdUC findAccountByOwnerIdUC;

    @RequestMapping(MeApiPaths.ME)
    public ResponseEntity<@NotNull ApiResponse<MeDTO>> validateSession() throws BadRequestException {
        var loggedUser = getAuthenticatedUserUC.execute().orElseThrow(AccessForbiddenException::new);

        var accountBalance = findAccountByOwnerIdUC.execute(loggedUser.user().getId());
        var balanceDTO = BalanceDTO.builder()
                .available(accountBalance.getBalanceAvailable().toBigDecimal())
                .reserved(accountBalance.getBalanceReserved().toBigDecimal())
                .build();

        var signInResponseDTO = authMapper.toSignInResponse(loggedUser.session());
        var responseDTO = new MeDTO(
                signInResponseDTO.getUser(),
                signInResponseDTO.getToken(),
                signInResponseDTO.getSessionId(),
                balanceDTO
        );
        return ResponseEntity.ok(ApiResponse.success("User session is valid", responseDTO));
    }
}
