package com.example.back.emailapi;

import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Async
@Service
@AllArgsConstructor
@RequiredArgsConstructor
public class EmailService {
    @Autowired
    private JavaMailSender emailSender;

    public void sendSimpleMessage(MailDto mailDto) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("rolend0305@gmail.com");
        message.setTo(mailDto.getEmailAddr());
        message.setSubject( mailDto.getEmailTitle());
        message.setText( mailDto.getEmailContent());
        emailSender.send(message);
    }
}
