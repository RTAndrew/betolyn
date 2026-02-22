package com.betolyn.features.bankroll.account.findglobalescrowaccount;

import com.betolyn.features.IUseCase;
import com.betolyn.features.bankroll.BankrollConstants;
import com.betolyn.features.bankroll.account.AccountEntity;
import com.betolyn.features.bankroll.account.AccountRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class FindGlobalEscrowAccountUC implements IUseCase<Void, AccountEntity> {

    private final AccountRepository accountRepository;

    @Override
    public AccountEntity execute(Void param) {
        return accountRepository.findByOwnerId(BankrollConstants.GLOBAL_ESCROW_ACCOUNT)
                .orElseThrow(() -> new IllegalStateException("GLOBAL_ESCROW account not found; run bankroll seed first"));
    }
}
