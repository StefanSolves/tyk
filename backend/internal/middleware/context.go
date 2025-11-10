package middleware

import (
	"context"

	"github.com/StefanSolves/tyk/backend/internal/types"
)

type contextKey string

const payloadKey = contextKey("payload")

func CtxSavePayload(ctx context.Context, payload *types.RegistrationPayload) context.Context {
	return context.WithValue(ctx, payloadKey, payload)
}

func CtxGetPayload(ctx context.Context) *types.RegistrationPayload {
	payload, ok := ctx.Value(payloadKey).(*types.RegistrationPayload)
	if !ok {
		panic("middleware.CtxGetPayload: payload not found in context")
	}
	return payload
}
