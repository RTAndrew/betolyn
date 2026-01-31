package com.betolyn.features.bankroll.account;

import com.betolyn.features.IUseCase;
import com.betolyn.features.user.UserEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class CreateAccountForUserUC implements IUseCase<UserEntity, AccountEntity> {

    private final AccountRepository accountRepository;

    @Override
    @Transactional
    public AccountEntity execute(UserEntity user) {
        var account = new AccountEntity(
                user.getId(),
                AccountOwnerTypeEnum.USER,
                BigDecimal.ZERO,
                BigDecimal.ZERO);
        return accountRepository.save(account);
    }
}
