package com.betolyn.features.bankroll.transaction;

import java.util.ArrayList;
import java.util.List;

import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.type.PostgreSQLEnumJdbcType;

import com.betolyn.features.user.UserEntity;
import com.betolyn.shared.baseEntity.BaseEntity;
import com.betolyn.shared.baseEntity.EntityUUID;
import com.betolyn.shared.money.BetMoney;
import com.betolyn.shared.money.BetMoneyAttributeConverter;
import com.betolyn.shared.money.MoneyConstants;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "transactions")
public class TransactionEntity extends BaseEntity {

    /**
     * A snapshot of the reference entity name
     * (e.g. criterion name, odd name, matchtitle).
     *
     * NOTE: The reference name is not bidirectional. It is only used to display
     * the reference name of referenced entity (referencedType or type).
     * Because the money may touch multiple entities, the reference name states the
     * final money destination,
     * optimizing querying.
     *
     * Not populated for {@link TransactionReferenceTypeEnum#BET_SLIP}.
     */
    @Column(name = "reference_name")
    private String referenceName;

    private String memo;

    /**
     * Reference ID of the entity of the type {@link TransactionReferenceTypeEnum}.
     */
    @Column(nullable = false)
    private String referenceId;

    @Column(nullable = false, precision = MoneyConstants.PRECISION, scale = MoneyConstants.SCALE)
    @Convert(converter = BetMoneyAttributeConverter.class)
    private BetMoney totalAmount = BetMoney.zero();

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    @JdbcType(PostgreSQLEnumJdbcType.class)
    private TransactionTypeEnum type;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    @JdbcType(PostgreSQLEnumJdbcType.class)
    private TransactionReferenceTypeEnum referenceType;

    @ManyToOne(optional = true)
    @JoinColumn(name = "created_by", nullable = true)
    private UserEntity createdBy;

    @OneToMany(mappedBy = "transaction", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TransactionItemEntity> items = new ArrayList<>();

    @Override
    protected EntityUUID getUUIDPrefix() {
        return new EntityUUID(12, "tx");
    }

    @PrePersist
    @PreUpdate
    private void calculateTotalAmount() {
        if (this.items == null || this.items.isEmpty()) {
            this.totalAmount = BetMoney.zero();
            return;
        }

        this.totalAmount = this.items
                .stream()
                .map(TransactionItemEntity::getAmount)
                .reduce((a, b) -> a.add(b))
                .orElse(BetMoney.zero());
    }
}
