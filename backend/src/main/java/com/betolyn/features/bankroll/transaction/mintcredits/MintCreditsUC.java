package com.betolyn.features.bankroll.transaction.mintcredits;

import com.betolyn.features.IUseCase;
import com.betolyn.features.bankroll.BankrollConstants;
import com.betolyn.features.bankroll.account.AccountEntity;
import com.betolyn.features.bankroll.account.AccountRepository;
import com.betolyn.features.bankroll.account.AccountTypeEnum;
import com.betolyn.features.bankroll.transaction.TransactionEntity;
import com.betolyn.features.bankroll.transaction.TransactionItemEntity;
import com.betolyn.features.bankroll.transaction.TransactionReferenceTypeEnum;
import com.betolyn.features.bankroll.transaction.TransactionRepository;
import com.betolyn.features.bankroll.transaction.TransactionTypeEnum;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class MintCreditsUC implements IUseCase<MintCreditsParam, TransactionEntity> {

    private final AccountRepository accountRepository;
    private final TransactionRepository transactionRepository;

    @Override
    @Transactional
    public TransactionEntity execute(MintCreditsParam param) {
        BigDecimal amount = param.getAmount();

        AccountEntity globalReserve = accountRepository.findByOwnerId(BankrollConstants.GLOBAL_RESERVE_ACCOUNT)
                .orElseThrow(() -> new IllegalStateException("GLOBAL_RESERVE account not found; run bankroll seed first"));

        AccountEntity userAccount = accountRepository.findByOwnerId(param.getUser().getId())
                .orElseThrow(() -> new IllegalStateException("User account not found for user " + param.getUser().getId()));

        globalReserve.setBalanceAvailable(globalReserve.getBalanceAvailable().subtract(amount));
        userAccount.setBalanceAvailable(userAccount.getBalanceAvailable().add(amount));
        accountRepository.save(globalReserve);
        accountRepository.save(userAccount);

        var transaction = new TransactionEntity();
        transaction.setMemo(param.getMemo());
        transaction.setType(TransactionTypeEnum.MINT_CREDITS);
        transaction.setReferenceId(param.getUser().getId());
        transaction.setReferenceType(TransactionReferenceTypeEnum.USER);
        param.getCreatedBy().ifPresent(transaction::setCreatedBy);

        var item = new TransactionItemEntity();
        item.setTransaction(transaction);
        item.setFromAccountId(globalReserve.getId());
        item.setFromAccountType(AccountTypeEnum.GLOBAL);
        item.setToAccountId(userAccount.getId());
        item.setToAccountType(AccountTypeEnum.USER_WALLET);
        item.setAmount(amount);
        transaction.getItems().add(item);

        return transactionRepository.save(transaction);
    }
}
