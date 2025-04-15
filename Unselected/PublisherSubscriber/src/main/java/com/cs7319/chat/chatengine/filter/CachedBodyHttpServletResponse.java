package com.cs7319.chat.chatengine.filter;

import jakarta.servlet.ServletOutputStream;
import jakarta.servlet.WriteListener;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpServletResponseWrapper;

import java.io.*;

public class CachedBodyHttpServletResponse extends HttpServletResponseWrapper {

    private final ByteArrayOutputStream cachedBytes = new ByteArrayOutputStream();
    private ServletOutputStream outputStream;
    private PrintWriter writer;

    public CachedBodyHttpServletResponse(HttpServletResponse response) {
        super(response);
    }

    @Override
    public ServletOutputStream getOutputStream() {
        if (this.outputStream == null) {
            this.outputStream = new CachedServletOutputStream(cachedBytes);
        }
        return this.outputStream;
    }

    @Override
    public PrintWriter getWriter() {
        if (this.writer == null) {
            this.writer = new PrintWriter(new OutputStreamWriter(cachedBytes));
        }
        return this.writer;
    }

    public String getBody() {
        try {
            this.flushBuffer(); // flush to capture content
        } catch (IOException e) {
           // throw new RuntimeException(e);
            System.out.println("#### Eating IOException");
        }
        return cachedBytes.toString();
    }

    public void copyBodyToResponse() throws IOException {
        ServletOutputStream out = super.getOutputStream();
        out.write(cachedBytes.toByteArray());
        out.flush();
    }

    private static class CachedServletOutputStream extends ServletOutputStream {
        private final OutputStream stream;
        public CachedServletOutputStream(OutputStream stream) {
            this.stream = stream;
        }

        @Override public boolean isReady() { return true; }
        @Override public void setWriteListener(WriteListener listener) {}
        @Override public void write(int b) throws IOException {
            stream.write(b);
        }
    }
}
