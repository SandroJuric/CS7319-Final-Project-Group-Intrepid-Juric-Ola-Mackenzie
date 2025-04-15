package com.cs7319.chat.chatengine.filter;

import jakarta.servlet.*;
import jakarta.servlet.http.*;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

@Component
public class RequestResponseLoggingFilter implements Filter {

    @Override
    public void doFilter(ServletRequest request, ServletResponse response,
                         FilterChain chain) throws IOException, ServletException {

        HttpServletRequest httpRequest = (HttpServletRequest) request;
        CachedBodyHttpServletRequest wrappedRequest = new CachedBodyHttpServletRequest(httpRequest);

        CachedBodyHttpServletResponse wrappedResponse = new CachedBodyHttpServletResponse((HttpServletResponse) response);

        // Log request
        String requestBody = new String(wrappedRequest.getInputStream().readAllBytes(), StandardCharsets.UTF_8);
        System.out.println("➡️ Incoming Request:");
        System.out.println(httpRequest.getMethod() + " " + httpRequest.getRequestURI());
        System.out.println("Request Body: " + requestBody);

        // Process request
        chain.doFilter(wrappedRequest, wrappedResponse);

        // Log response
        String responseBody = wrappedResponse.getBody();
        System.out.println("⬅️ Outgoing Response:");
        System.out.println("Status: " + wrappedResponse.getStatus());
        System.out.println("Response Body: " + responseBody);

        // Finalize response (write cached content back to client)
        wrappedResponse.copyBodyToResponse();
    }
}
