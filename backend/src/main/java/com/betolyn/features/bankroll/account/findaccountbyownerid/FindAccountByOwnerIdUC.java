package com.betolyn.features.bankroll.account.findaccountbyownerid;

import com.betolyn.features.IUseCase;
import com.betolyn.features.bankroll.account.AccountEntity;
import com.betolyn.features.bankroll.account.AccountRepository;
import com.betolyn.shared.exceptions.EntityNotfoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class FindAccountByOwnerIdUC implements IUseCase<String, AccountEntity> {

    private final AccountRepository accountRepository;

    @Override
    public AccountEntity execute(String ownerId) throws EntityNotfoundException {
        return accountRepository.findByOwnerId(ownerId)
                .orElseThrow(EntityNotfoundException::new);
    }
}
