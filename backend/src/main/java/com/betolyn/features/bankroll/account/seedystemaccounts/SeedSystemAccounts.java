package com.betolyn.features.bankroll.account.seedystemaccounts;

import com.betolyn.features.bankroll.account.AccountApiPaths;
import com.betolyn.features.bankroll.account.AccountEntity;
import com.betolyn.utils.responses.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(AccountApiPaths.ACCOUNTS)
@RequiredArgsConstructor
public class SeedSystemAccounts {

    private final SeedSystemAccountsUC seedSystemAccountsUC;

    @PostMapping("/seed")
    public ResponseEntity<ApiResponse<List<AccountEntity>>> seed() {
        var accounts = seedSystemAccountsUC.execute();
        return ResponseEntity.ok(ApiResponse.success("System accounts seeded", accounts));
    }
}
