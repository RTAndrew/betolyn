package com.betolyn.features.bankroll.account.createaccountforspace;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.betolyn.features.IUseCase;
import com.betolyn.features.bankroll.account.AccountEntity;
import com.betolyn.features.bankroll.account.AccountOwnerTypeEnum;
import com.betolyn.features.bankroll.account.AccountRepository;
import com.betolyn.features.spaces.SpaceEntity;
import com.betolyn.shared.money.BetMoney;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CreateAccountForSpaceUC implements IUseCase<SpaceEntity, AccountEntity> {

    private final AccountRepository accountRepository;

    @Override
    @Transactional
    public AccountEntity execute(SpaceEntity space) {
        var account = new AccountEntity(
                space.getId(),
                AccountOwnerTypeEnum.SPACE,
                BetMoney.zero(),
                BetMoney.zero());
        return accountRepository.save(account);
    }
}
