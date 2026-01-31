package com.betolyn.features.bankroll.account;

import com.betolyn.features.IUseCaseNoParams;
import com.betolyn.features.bankroll.BankrollConstants;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

/**
 * Ensures the two system accounts (GLOBAL_RESERVE, GLOBAL_ESCROW) exist.
 * <p>
 * This use case is intended to be run only during seed (e.g. via POST
 * /bankroll/seed).
 * Do not rely on it for normal application startup or production flows.
 * </p>
 */
@Service
@RequiredArgsConstructor
public class SeedSystemAccountsUC implements IUseCaseNoParams<List<AccountEntity>> {

        private final AccountRepository accountRepository;

        @Override
        @Transactional
        public List<AccountEntity> execute() {
                var reserve = accountRepository.findByOwnerId(BankrollConstants.GLOBAL_RESERVE_ACCOUNT)
                                .orElseGet(() -> accountRepository.save(new AccountEntity(
                                                BankrollConstants.GLOBAL_RESERVE_ACCOUNT,
                                                AccountOwnerTypeEnum.SYSTEM,
                                                BigDecimal.ZERO,
                                                BigDecimal.ZERO)));
                var escrow = accountRepository.findByOwnerId(BankrollConstants.GLOBAL_ESCROW_ACCOUNT)
                                .orElseGet(() -> accountRepository.save(new AccountEntity(
                                                BankrollConstants.GLOBAL_ESCROW_ACCOUNT,
                                                AccountOwnerTypeEnum.SYSTEM,
                                                BigDecimal.ZERO,
                                                BigDecimal.ZERO)));
                return List.of(reserve, escrow);
        }
}
