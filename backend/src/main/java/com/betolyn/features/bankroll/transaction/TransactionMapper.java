package com.betolyn.features.bankroll.transaction;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import org.mapstruct.AfterMapping;
import org.mapstruct.Context;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.Named;
import org.springframework.stereotype.Component;

import com.betolyn.features.bankroll.transaction.dto.TransactionDTO;
import com.betolyn.features.bankroll.transaction.dto.TransactionItemDTO;
import com.betolyn.features.user.UserMapper;
import com.betolyn.shared.BaseMapperConfig;
import com.betolyn.shared.MoneyMapper;
import com.betolyn.shared.money.BetMoney;

@Mapper(config = BaseMapperConfig.class, uses = { UserMapper.class, MoneyMapper.class })
@Component
public interface TransactionMapper {

    @Named("localDateTimeToString")
    static String localDateTimeToString(LocalDateTime value) {
        return value == null ? null : value.toString();
    }

    @Mapping(target = "items", ignore = true)
    @Mapping(target = "totalAmount", ignore = true)
    @Mapping(source = "createdAt", target = "createdAt", qualifiedByName = "localDateTimeToString")
    @Mapping(source = "updatedAt", target = "updatedAt", qualifiedByName = "localDateTimeToString")
    TransactionDTO toMyTransactionDTO(TransactionEntity entity, @Context String viewerAccountId);

    @AfterMapping
    default void fillItemsAndTotalForViewer(
            @MappingTarget TransactionDTO dto,
            TransactionEntity entity,
            @Context String viewerAccountId) {
        if (entity.getItems() == null) {
            dto.setItems(List.of());
            dto.setTotalAmount(BigDecimal.ZERO);
            return;
        }

        // Filter items for the viewer
        var items = entity.getItems().stream()
                .filter(i -> viewerAccountId.equals(i.getFromAccountId())
                        || viewerAccountId.equals(i.getToAccountId()))
                .map(this::toItemDTO)
                .toList();
        dto.setItems(items);

        // Show the total amount for the viewer (and negate the values automatically)
        // total = toAccountTotal - fromAccountTotal
        var toAccountTotal = entity.getItems().stream()
                .filter(i -> viewerAccountId.equals(i.getToAccountId()))
                .map(TransactionItemEntity::getAmount).reduce(BetMoney.zero(), BetMoney::add);

        var fromAccountTotal = entity.getItems().stream()
                .filter(i -> viewerAccountId.equals(i.getFromAccountId()))
                .map(TransactionItemEntity::getAmount).reduce(BetMoney.zero(), BetMoney::add);
        var total = toAccountTotal.subtract(fromAccountTotal);
        dto.setTotalAmount(total.toBigDecimal());
    }

    @Mapping(source = "createdAt", target = "createdAt", qualifiedByName = "localDateTimeToString")
    @Mapping(source = "updatedAt", target = "updatedAt", qualifiedByName = "localDateTimeToString")
    @Mapping(source = "amount", target = "amount", qualifiedByName = "betMoneyToBigDecimal")
    TransactionItemDTO toItemDTO(TransactionItemEntity item);
}
