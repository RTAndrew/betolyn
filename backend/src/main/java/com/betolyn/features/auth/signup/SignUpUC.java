package com.betolyn.features.auth.signup;

import com.betolyn.features.IUseCase;
import com.betolyn.features.auth.exceptions.EmailAlreadyInUseException;
import com.betolyn.features.auth.exceptions.UsernameAlreadyInUseException;
import com.betolyn.features.bankroll.account.createaccountforuser.CreateAccountForUserUC;
import com.betolyn.features.bankroll.BankrollConstants;
import com.betolyn.features.bankroll.transaction.mintcredits.MintCreditsParam;
import com.betolyn.features.bankroll.transaction.mintcredits.MintCreditsUC;
import com.betolyn.features.user.UserEntity;
import com.betolyn.features.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class SignUpUC implements IUseCase<SignUpRequestDTO, UserEntity> {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final CreateAccountForUserUC createAccountForUserUC;
    private final MintCreditsUC mintCreditsUC;

    @Override
    @Transactional
    public UserEntity execute(SignUpRequestDTO requestDTO) {
        String email = requestDTO.getEmail();
        Optional<UserEntity> existsEmail = Optional.ofNullable(userRepository.findByEmail(email));
        Optional<UserEntity> existsUsername = Optional
                .ofNullable(userRepository.findByUsername(requestDTO.getUsername()));

        if (existsEmail.isPresent()) {
            throw new EmailAlreadyInUseException();
        }

        if (existsUsername.isPresent()) {
            throw new UsernameAlreadyInUseException();
        }

        requestDTO.setPassword(passwordEncoder.encode(requestDTO.getPassword()));
        var newUser = new UserEntity(requestDTO.getPassword(), email, requestDTO.getUsername());
        var savedUser = userRepository.save(newUser);
        createAccountForUserUC.execute(savedUser);
        mintCreditsUC.execute(new MintCreditsParam(
                savedUser,
                BankrollConstants.INITIAL_MINT_AMOUNT,
                "Initial credits",
                Optional.of(savedUser)
        ));
        return savedUser;
    }
}
