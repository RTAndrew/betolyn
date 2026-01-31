package com.betolyn.features.bankroll.account.createaccountforuser;

import com.betolyn.features.bankroll.account.AccountApiPaths;
import com.betolyn.features.bankroll.account.AccountEntity;
import com.betolyn.features.user.finduserbyid.FindUserByIdUC;
import com.betolyn.utils.responses.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(AccountApiPaths.ACCOUNTS)
@RequiredArgsConstructor
public class CreateAccountForUser {

    private final CreateAccountForUserUC createAccountForUserUC;
    private final FindUserByIdUC findUserByIdUC;

    @PostMapping
    public ResponseEntity<ApiResponse<AccountEntity>> create(@RequestBody CreateAccountForUserRequestDTO request) {
        var user = findUserByIdUC.execute(request.getUserId());
        var account = createAccountForUserUC.execute(user);
        return ResponseEntity.ok(ApiResponse.success("Account created", account));
    }
}
